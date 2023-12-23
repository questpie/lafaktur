"use client";

import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { api } from "~/trpc/react";

export default function OrganizationOnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [organizations] = api.organization.getByUser.useSuspenseQuery(
    undefined,
    { refetchInterval: false, refetchOnMount: false },
  );

  const createOrganization = api.organization.create.useMutation({
    onSettled(_, error) {
      if (error) return;
      return queryClient.invalidateQueries(
        getQueryKey(api.organization.getByUser, undefined, "query"),
      );
    },
    onSuccess() {
      router.push("/dashboard");
    },
  });
  const me = useSession().data!.user;

  const [orgName, setName] = useState<string>(me.name ?? "");

  const slug = orgName.toLowerCase().replace(/\s/g, "-");

  const handleOrgCreate = () => {
    createOrganization.mutate({
      name: orgName,
      slug,
    });
  };

  if (organizations?.length) {
    // we already have an organization redirect to dashboard
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="mx-auto flex h-screen w-full max-w-xl items-center">
      <div className="w-full">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Welcome {me.name?.split(" ")[0]} !
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">
            Please create an organization to get started.
          </p>
        </div>
        <div className="mt-6">
          <Label htmlFor="orgName">Organization name</Label>
          <div className="mt-1 flex w-full flex-row space-x-4">
            <Input
              size="lg"
              type="text"
              id="orgName"
              placeholder="My organization"
              value={orgName}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              size="lg"
              onClick={handleOrgCreate}
              isLoading={createOrganization.isLoading}
            >
              Create
            </Button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            You can find your organization at lafaktur.com/{slug}
          </p>
        </div>
      </div>
    </div>
  );
}
