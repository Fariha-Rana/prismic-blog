import Link from "next/link";
import * as prismic from "@prismicio/client";

import { PrismicText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

import { Bounded } from "../layout/Bounded";
import { HorizontalDivider } from "../HorizontalDivider";
import { Profile } from "@/components/auth/Profile";
import NavItem from "./NavItem";
import { Search } from "@/components/search/Search";

export const Header = ({
  withDivider = true,
  withProfile = true,
  navigation,
  settings,
}) => {
  return (
    <Bounded as="header">
      <div className="grid grid-cols-1 justify-items-center gap-20 gap-y-8">
        <Search />
        <nav>
          <ul className="flex flex-wrap justify-center gap-10">
            <NavItem>
              <Link href="/">
                <PrismicText field={navigation.data.homepageLabel} />
              </Link>
            </NavItem>
            {navigation.data?.links.map((item) => (
              <NavItem key={prismic.asText(item.label)}>
                <PrismicNextLink field={item.link}>
                  <PrismicText field={item.label} />
                </PrismicNextLink>
              </NavItem>
            ))}
          </ul>
        </nav>
        {withProfile && (
          <Profile
            name={settings.data.name}
            description={settings.data.description}
            profilePicture={settings.data.profilePicture}
          />
        )}
        {withDivider && <HorizontalDivider />}
      </div>
    </Bounded>
  );
};
