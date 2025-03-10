// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth"; // Import NextAuth for authentication
import CredentialsProvider from "next-auth/providers/credentials"; // Import Credentials provider for email/password auth
import GoogleProvider from "next-auth/providers/google"; // Import Google provider for OAuth
import { MongoClient } from "mongodb"; // Import MongoDB client for database operations
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing/comparison

// Create a MongoDB client instance using environment variable for connection string
const client = new MongoClient(process.env.MONGODB_URI);

// Configure NextAuth with authentication providers and settings
export default NextAuth({
    providers: [
        // Email/Password authentication provider
        CredentialsProvider({
            name: "Credentials", // Display name for this provider
            credentials: {
                email: { label: "Email", type: "text" }, // Email field configuration
                password: { label: "Password", type: "password" } // Password field configuration
            },
            // Authorization function that validates credentials
            async authorize(credentials) {
                await client.connect(); // Connect to MongoDB
                const usersCollection = client.db().collection("users"); // Get users collection
                // Find user by email
                const user = await usersCollection.findOne({ email: credentials.email });
                // Validate user existence and password
                if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
                    throw new Error("Invalid credentials"); // Throw error if validation fails
                }
                // Return user object with id, email, and role if successful
                return { id: user._id, email: user.email, role: user.role };
            }
        }),
        // Google OAuth provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID, // Google client ID from env
            clientSecret: process.env.GOOGLE_CLIENT_SECRET // Google client secret from env
        })
    ],
    secret: process.env.NEXTAUTH_SECRET, // Secret for signing JWT tokens
    callbacks: {
        // Callback to customize session object
        async session({ session, token }) {
            session.user.id = token.sub; // Add user ID to session
            session.user.role = token.role; // Add user role to session
            return session;
        },
        // Callback to customize JWT token
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role; // Add role to token when user is present
            }
            return token;
        }
    }
});

// Middleware for role-based access control (RBAC)
// Takes array of allowed roles as arguments
export function checkRole(...roles) {
    return (req, res, next) => {
        // Check if user exists and has required role
        if (!req.user || !roles.includes(req.user.role)) {
            // Return 403 Forbidden if check fails
            return res.status(403).json({ message: "Access denied" });
        }
        next(); // Proceed to next middleware if check passes
    };
}

// Frontend helper function to check user roles
// Takes user object and array of roles to check against
export function hasRole(user, ...roles) {
    return roles.includes(user?.role); // Return true if user has any of the specified roles
}

// Higher-order component (HOC) for protecting pages with role-based access
import { useSession } from "next-auth/react"; // Hook to get session data
import { useRouter } from "next/router"; // Hook for routing

// HOC that wraps a component with role-based protection
export function withRole(Component, ...requiredRoles) {
    return function ProtectedComponent(props) {
        const { data: session, status } = useSession(); // Get session data and status
        const router = useRouter(); // Get router instance

        // Show loading state while session is being fetched
        if (status === "loading") return <p>Loading...</p>;

        // Redirect to unauthorized page if user lacks required role
        if (!session || !requiredRoles.includes(session.user.role)) {
            router.push("/unauthorized");
            return null;
        }

        // Render the protected component if all checks pass
        return <Component {...props} />;
    };
}