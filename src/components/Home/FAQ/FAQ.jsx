import Header1 from "@/components/Typo/Header1";
import Paragraph from "@/components/Typo/Paragraph";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function FAQ({
  headerStyle = "mx-auto max-w-3xl space-y-6 text-center",
  contentStyle = "mx-auto mt-12 max-w-3xl space-y-4",
  containerStyle = "py-12 px-3 md:py-24",
  cardDisplay = true,
  headerText,
}) {
  return (
    <section className={` ${containerStyle}`}>
      <div className={`${headerStyle}`}>
        {cardDisplay ? (
          <Header1 className={headerText}>Frequently Asked Questions</Header1>
        ) : (
          <h2 className={headerText}>Frequently Asked Questions</h2>
        )}
        <p className="text-muted-foreground">
          Have questions? We’ve got answers! Find out more about our home
          services below.
        </p>
      </div>
      <div className={` ${contentStyle}`}>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-md">
              How do I book a home service?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Booking is simple! Browse available services, select your
                preferred time, and confirm your booking. Once confirmed, a
                professional housekeeper will be assigned to you.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-md">
              Are the housekeepers verified?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Yes, all housekeepers go through a strict screening process,
                including background checks and skill assessments, to ensure
                reliability and professionalism.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-md">
              What payment methods do you accept?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                We accept major credit cards, PayPal, and digital wallets.
                Payments are processed securely to protect your information.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-md">
              What happens if I need to reschedule or cancel?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                You can reschedule or cancel your booking through your account.
                Please note that cancellations made within 24 hours of the
                appointment may be subject to a fee.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-md">
              Do you offer any guarantees on your services?
            </AccordionTrigger>
            <AccordionContent>
              <p>
                Absolutely! If you’re not satisfied with the service, let us
                know within 24 hours, and we’ll make it right. Customer
                satisfaction is our top priority.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {cardDisplay && (
        <div className="flex justify-center items-center flex-col max-w-3xl mx-auto bg-secondary p-6 mt-12 rounded-2xl min-h-56 gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Still have question?</h2>
            <p className="mt-2 text-gray-400">
              Have questions or need assistance? Our team is here to help!
            </p>
          </div>
          <Link to={"/"}>
            <Button className="">Contact us!</Button>
          </Link>
        </div>
      )}
    </section>
  );
}
