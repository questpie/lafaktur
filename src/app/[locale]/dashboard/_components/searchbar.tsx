import { useTranslations } from "next-intl";
import { LuSearch } from "react-icons/lu";
import { Button } from "~/app/_components/ui/button";
import { Input } from "~/app/_components/ui/input";

export function SearchBar() {
  const t = useTranslations("dashboard.searchbar");

  return (
    <div className="flex w-full max-w-xl flex-row gap-0">
      <Input
        variant="filled"
        className={{ wrapper: "w-full rounded-e-none  " }}
        before={<LuSearch />}
        placeholder={t("placeholder")}
      />
      <Button variant="default" className="rounded-s-none">
        {t("button")}
      </Button>
    </div>
  );
}
