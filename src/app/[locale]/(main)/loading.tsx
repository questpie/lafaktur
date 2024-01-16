import { Spinner } from "~/app/_components/ui/spinner";

export default function MainLoading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Spinner size="lg" />
    </div>
  );
}
