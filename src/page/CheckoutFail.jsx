import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"


export default function CheckoutFail() {
  return (
    <Card className="w-full max-w-md mx-auto mt-20 text-center">
      <CardHeader>
        <CardTitle>Payment Failed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AtSignIcon className="w-12 h-12 mx-auto text-red-500" />
          <p className="text-gray-500">
            Unfortunately, your payment could not be processed. Please check your payment details and try again.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="mx-auto">
          <Link to={"/"} className="text-white" prefetch={false}>
            Return home
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function AtSignIcon(props) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </svg>
  )
}