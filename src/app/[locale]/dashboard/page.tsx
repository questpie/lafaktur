"use client";

import { LuPlus } from "react-icons/lu";
import { useHeader } from "~/app/[locale]/dashboard/_components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";

export default function DashboardPage() {
  useHeader({
    title: "Dashboard",
    description:
      "This is the dashboard. You can see all your overview details here.",
    mainAction: {
      label: "Main action",
      icon: <LuPlus />,
    },
    secondaryAction: {
      label: "Secondary action",
    },
    otherActions: [
      {
        label: "Other action",
      },
    ],
  });

  return (
    <div className=" grid h-full w-full  grid-cols-12 grid-rows-6 gap-6">
      <Card className="col-span-4 row-span-4">
        <CardHeader>
          <CardTitle>Karta</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga quas,
            beatae maxime necessitatibus reprehenderit quos optio. Illum
            nostrum, consequatur facere, atque quo, minus fugit non repudiandae
            consectetur numquam alias harum autem ut quaerat dolores dolorem
            reiciendis totam provident? Fuga officia quibusdam quia at minima
            alias ducimus sapiente eius, molestias porro earum itaque voluptatem
            eaque doloremque suscipit minus id debitis omnis? Deserunt magnam
            doloremque sint ad! Voluptate sapiente esse officia illum hic
            officiis molestias eaque, magni iusto! Officia excepturi quos alias,
            reiciendis maiores a quisquam id autem laborum natus iusto sapiente,
            quae facilis nesciunt in doloribus aut cum perspiciatis ullam
            corrupti at blanditiis. Dolorum accusamus nisi ad enim quibusdam
            numquam consectetur, repellendus autem pariatur quasi inventore
            sequi asperiores dolorem mollitia molestiae.
          </CardDescription>
        </CardContent>
      </Card>
      <Card className="col-span-8 row-span-2">
        <CardHeader>
          <CardTitle>Karta</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga quas,
            beatae maxime necessitatibus reprehenderit quos optio. Illum
            nostrum, consequatur facere, atque quo, minus fugit non repudiandae
            consectetur numquam alias harum autem ut quaerat dolores dolorem
            reiciendis totam provident? Fuga officia quibusdam quia at minima
            alias ducimus sapiente eius, molestias porro earum itaque voluptatem
            eaque doloremque suscipit minus id debitis omnis? Deserunt magnam
            doloremque sint ad! Voluptate sapiente esse officia illum hic
            officiis molestias eaque, magni iusto! Officia excepturi quos alias,
            reiciendis maiores a quisquam id autem laborum natus iusto sapiente,
            quae facilis nesciunt in doloribus aut cum perspiciatis ullam
            corrupti at blanditiis. Dolorum accusamus nisi ad enim quibusdam
            numquam consectetur, repellendus autem pariatur quasi inventore
            sequi asperiores dolorem mollitia molestiae.
          </CardDescription>
        </CardContent>
      </Card>
      <Card className="col-span-8 row-span-2">
        <CardHeader>
          <CardTitle>Karta</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga quas,
            beatae maxime necessitatibus reprehenderit quos optio. Illum
            nostrum, consequatur facere, atque quo, minus fugit non repudiandae
            consectetur numquam alias harum autem ut quaerat dolores dolorem
            reiciendis totam provident? Fuga officia quibusdam quia at minima
            alias ducimus sapiente eius, molestias porro earum itaque voluptatem
            eaque doloremque suscipit minus id debitis omnis? Deserunt magnam
            doloremque sint ad! Voluptate sapiente esse officia illum hic
            officiis molestias eaque, magni iusto! Officia excepturi quos alias,
            reiciendis maiores a quisquam id autem laborum natus iusto sapiente,
            quae facilis nesciunt in doloribus aut cum perspiciatis ullam
            corrupti at blanditiis. Dolorum accusamus nisi ad enim quibusdam
            numquam consectetur, repellendus autem pariatur quasi inventore
            sequi asperiores dolorem mollitia molestiae.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
