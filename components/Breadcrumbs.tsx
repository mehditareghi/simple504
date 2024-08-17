"use client";

import { Fragment, useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createClient } from "@/utils/supabase/client";

// Define a type for the labels
interface Label {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const supabase = createClient();

  // Split the pathname into segments and memoize the result
  const pathSegments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname],
  );

  const [labels, setLabels] = useState<Label[]>([]);
  const cache = useMemo(() => new Map(), []);

  useEffect(() => {
    const fetchLabels = async () => {
      const tempLabels: Label[] = await Promise.all(
        pathSegments.map(async (segment, index) => {
          let label = segment.charAt(0).toUpperCase() + segment.slice(1);
          let href = `/${pathSegments.slice(0, index + 1).join("/")}`;

          // Check if the label is already in the cache
          if (cache.has(segment)) {
            return { label: cache.get(segment), href };
          }

          // Custom labels for specific paths
          if (segment === "admin-dashboard") {
            label = "Admin Dashboard";
          } else if (index === 1) {
            // Fetch course name
            const { data, error } = await supabase
              .from("courses")
              .select("name")
              .eq("id", segment)
              .single();
            if (!error && data) {
              label = data.name;
              cache.set(segment, data.name); // Cache the result
            }
          } else if (index === 2) {
            // Fetch unit title
            const { data, error } = await supabase
              .from("units")
              .select("title")
              .eq("id", segment)
              .single();
            if (!error && data) {
              label = data.title;
              cache.set(segment, data.title); // Cache the result
            }
          }

          return { label, href };
        }),
      );
      setLabels(tempLabels);
    };

    fetchLabels();
  }, [pathSegments]); // Removed unnecessary dependencies

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Frendere</BreadcrumbLink>
        </BreadcrumbItem>
        {labels.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index < labels.length - 1 ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
