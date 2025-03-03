import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"


export default function CheckoutSuccess() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <CircleCheckIcon className="w-16 h-16 text-green-500" />
      <h1 className="mt-4 text-2xl font-semibold text-center">Thank you for your order!</h1>
      <p className="mt-2 text-center text-gray-500">Your booking was successfully placed and is being processed.</p>
      <Button className="mt-8">
        <Link to={"/"}>
          Return to Homepage
        </Link>
      </Button>
    </div>
  )
}

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}