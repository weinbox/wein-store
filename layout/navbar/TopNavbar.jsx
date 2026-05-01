import React from "react";
import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";

//internal imports
import LogoutButton from "./LogoutButton";
import { showingTranslateValue } from "@lib/translate";
import SelectLanguage from "@components/form/SelectLanguage";
import TopNavbarTheme from "./TopNavbarTheme";
import SelectLayout from "@components/form/SelectLayout";
import { getShowingLanguage } from "@services/SettingServices";
import { getShowingThemes, getDefaultTheme } from "@services/ThemeServices";
import { getGlobalSettings } from "@lib/actions/settings.actions";

const TopNavbar = async ({ storeCustomization }) => {
  const navbar = storeCustomization?.navbar;

  const [
    { languages },
    { themes },
    { theme: defaultTheme },
    { globalSetting },
  ] = await Promise.all([
    getShowingLanguage(),
    getShowingThemes(),
    getDefaultTheme(),
    getGlobalSettings(),
  ]);

  const storeLayout = globalSetting?.store_layout || "default";

  return (
    <div className="hidden lg:block bg-muted">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
        <div className="text-muted-foreground py-2 font-sans text-xs font-medium flex justify-between items-center">
          <span className="flex items-center">
            <FiPhoneCall className="mr-2" />
            {showingTranslateValue(navbar?.help_text)}
            <a
              href={`tel:${navbar?.phone || "+099949343"}`}
              className="font-bold text-primary ml-1"
            >
              {navbar?.phone || "+099949343"}
            </a>
          </span>

          <div className="lg:text-right flex items-center navBar">
            {navbar?.about_menu_status && (
              <div>
                <Link
                  href="/about-us"
                  className="font-medium hover:text-primary"
                >
                  {showingTranslateValue(navbar?.about_us)}
                </Link>
                <span className="mx-2">|</span>
              </div>
            )}
            {navbar?.contact_menu_status && (
              <div>
                <Link
                  href="/contact-us"
                  className="font-medium hover:text-primary"
                >
                  {showingTranslateValue(navbar?.contact_us)}
                </Link>
                <span className="mx-2">|</span>
              </div>
            )}

            <LogoutButton storeCustomization={storeCustomization} />

            <div className="flex items-center ml-4 gap-2 border-l border-border pl-4">
              <SelectLanguage data={languages} size="text-xs" />
              <TopNavbarTheme
                themes={themes}
                defaultTheme={defaultTheme}
                size="text-xs"
              />
              <SelectLayout currentLayout={storeLayout} size="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
