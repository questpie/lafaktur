"use client";

import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { useSession } from "~/app/[locale]/auth/_components/auth-provider";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { normalizeOrganizationName } from "~/shared/organization/organization-utils";
import { api } from "~/trpc/react";

export default function OrganizationOnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createOrganization = api.organization.create.useMutation({
    onSettled(_, error) {
      if (error) return;
      return queryClient.invalidateQueries(
        getQueryKey(api.organization.getByUser, undefined, "query"),
      );
    },
    onSuccess(data) {
      router.push(`/${data.slug}`);
    },
  });
  const session = useSession();
  const me = session?.user;
  const [orgName, setName] = useState<string>(me?.name ?? "");

  const slug = normalizeOrganizationName(orgName);

  const handleOrgCreate = () => {
    createOrganization.mutate({
      name: orgName,
      slug,
    });
  };

  return (
    <div className="mx-auto flex h-screen w-full max-w-xl items-center">
      <div className="w-full">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Welcome {me?.name.split(" ")[0]} !
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
