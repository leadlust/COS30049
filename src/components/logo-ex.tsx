/* eslint-disable react/no-unescaped-entities */
import { CustomLogo } from "./custom-logo"

export default function LogoExamples() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold mb-4">Logo Examples</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Default Logo</h3>
        <div className="p-4 border rounded-lg">
          <CustomLogo />
        </div>
        <p className="text-sm text-muted-foreground">Default logo with letter "C" and text "CryptoTrack"</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Custom Letter Logo</h3>
        <div className="p-4 border rounded-lg">
          <CustomLogo text="BlockChain" letter="B" bgColor="bg-gradient-to-br from-purple-500 to-blue-500" />
        </div>
        <p className="text-sm text-muted-foreground">
          Custom letter "B" with text "BlockChain" and purple-blue gradient
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Image Logo</h3>
        <div className="p-4 border rounded-lg">
          <CustomLogo text="CoinBase" imageUrl="/placeholder.svg?height=32&width=32" width={32} height={32} />
        </div>
        <p className="text-sm text-muted-foreground">Image logo with text "CoinBase" (using placeholder image)</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Image-Only Logo</h3>
        <div className="p-4 border rounded-lg">
          <CustomLogo text="" imageUrl="/placeholder.svg?height=40&width=40" width={40} height={40} />
        </div>
        <p className="text-sm text-muted-foreground">Image-only logo without text</p>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="text-lg font-medium mb-2">How to Use</h3>
        <p className="text-sm text-muted-foreground mb-4">
          To use your custom logo, place your logo image in the public folder and update the CustomLogo component in
          your header and footer:
        </p>
        <pre className="p-4 bg-black/10 dark:bg-black/30 rounded-lg overflow-x-auto text-xs">
          {
            <CustomLogo 
  text="ChainSwitch"
  imageUrl="public/assets/your-logo.png" 
  width={40} 
  height={40} 
/>
}
        </pre>
      </div>
    </div>
  )
}

