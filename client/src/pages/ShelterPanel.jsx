import PetList from "../components/PetList";
import { Tab } from "@headlessui/react";
import PetCreate from "../components/PetCreate";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ShelterPanel() {
  const tabs = ["Add Pet", "My Pets"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <PetCreate />
          </Tab.Panel>
          <Tab.Panel>
            <PetList />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}