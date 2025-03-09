import Image from "next/image"
import Link from "next/link"

type LogoProps = {
  text?: string
  imageUrl?: string
  letter?: string
  href?: string
  width?: number
  height?: number
  className?: string
  textColor?: string
  bgColor?: string
}

export function CustomLogo({
  text = "ChainSwitch",
  imageUrl = "/assets/logo.png",
  letter = "C",
  href = "/",
  width = 32,
  height = 32,
  className = "",
  textColor = "",
  bgColor = "bg-gradient-to-br from-yellow-400 to-yellow-300",
}: LogoProps) {
  const logoContent = (
    <div className={`flex items-center gap-2 font-bold ${className}`}>
      {imageUrl ? (
        <Image
          src={imageUrl || "/icon.png"}
          alt={text || "Logo"}
          width={width}
          height={height}
          className="object-contain"
        />
      ) : (
        <div className={`size-8 rounded-lg ${bgColor} flex items-center justify-center text-black`}>{letter}</div>
      )}
      {text && <span className={textColor}>{text}</span>}
    </div>
  )

  if (href) {
    return <Link href={href}>{logoContent}</Link>
  }

  return logoContent
}

