import type { RouterOutputs } from "~/trpc/shared";

type CustomerDetailsProps = {
  customer: RouterOutputs["customer"]["getById"];
};

export function CustomerDetails(props: CustomerDetailsProps) {
  // return list of customer details
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 text-sm">
        <div className="font-semibold text-muted-foreground">Customer name</div>
        <div className="font-semibold">{props.customer.name}</div>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <div className="font-semibold text-muted-foreground">
          Customer email
        </div>
        <div className="font-semibold">{props.customer.email ?? "-"}</div>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <div className="font-semibold text-muted-foreground">
          Customer phone
        </div>
        <div className="font-semibold">{props.customer.phone ?? "-"}</div>
      </div>
    </div>
  );
}
