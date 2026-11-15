import { UserRole } from "@/types";


export interface SubRoute {
    id: number;
    title: string;
    rout: string;
    roles?: UserRole[]; // omitted = all roles
}

export interface ProfileRoute {
    id: number;
    title: string;
    rout: string;
    roles?: UserRole[]; // omitted = all roles
    routs: SubRoute[];
}

// Reusable role groups
const SELLER_ROLES = [
    UserRole.INDIVIDUAL_USER,
    UserRole.CHARITY_SHOP,
    UserRole.ECO_FRIENDLY_STORE,
    UserRole.CELEBRITY,
    UserRole.AMBASSADOR,
    UserRole.PROFESSIONAL_SELLER,
];

export const profileRouts: ProfileRoute[] = [
    {
        id: 1,
        title: "Dashboard",
        rout: "/profile",
        routs: [
            { id: 2, title: "Dashboard", rout: "/profile" },
        ],
    },
    {
        id: 3,
        title: "Purchase",
        rout: "/profile/purchase",
        roles: SELLER_ROLES.filter(
            (role) => (role !== UserRole.ECO_FRIENDLY_STORE && role !== UserRole.CHARITY_SHOP)
        ),
        routs: [
            { id: 4, title: "Orders", rout: "/profile/purchase/orders" },
            { id: 5, title: "Returns", rout: "/profile/purchase/returns" },
        ],
    },
    {
        id: 6,
        title: "Selling",
        rout: "/profile/sell",
        roles: SELLER_ROLES,
        routs: [
            { id: 7, title: "Products", rout: "/profile/sell/products" },
            { id: 8, title: "Orders", rout: "/profile/sell/orders" },
            { id: 9, title: "Returns", rout: "/profile/sell/returns" },
            {
                id: 10,
                title: "Bundle Discount",
                rout: "/profile/sell/bundle-discount",
            },
        ],
    },
    {
        id: 11,
        title: "Assisted Selling",
        rout: "/profile/assisted-sell",
        roles: SELLER_ROLES,
        routs: [{ id: 11.5, title: "Requests", rout: "/profile/assisted-sell" }],
    },
    {
        id: 12,
        title: "Donation",
        rout: "/profile/donation",
        roles: [UserRole.CHARITABLE_ORGANIZATION, UserRole.CHARITY_SHOP],
        routs: [
            { id: 13, title: "Monetory Donation", rout: "/profile/donation" },
            { id: 14, title: "Cloth Donation", rout: "/profile/donation/cloth", roles: [UserRole.CHARITY_SHOP] },
        ],
    },
    {
        id: 12,
        title: "Donation Contribution",
        rout: "/profile/donation-contribution",
        roles: SELLER_ROLES.filter(
            (role) => role !== UserRole.CHARITY_SHOP
        ),
        routs: [
            { id: 13, title: "Monetory Donation", rout: "/profile/donation-contribution" },
            { id: 14, title: "Cloth Donation", rout: "/profile/donation-contribution/cloth-donation" },
        ],
    },
    {
        id: 15,
        title: "Payment",
        rout: "/profile/earnings",
        routs: [{ id: 15.5, title: "Earnings", rout: "/profile/earnings" }],
    },
    {
        id: 16,
        title: "Settings",
        rout: "/profile",
        routs: [
            { id: 17, title: "Profile", rout: "/profile/edit", },
            { id: 18, title: "Address", rout: "/profile/address", roles: SELLER_ROLES },
            { id: 19, title: "Badges", rout: "/profile/badges" },
            { id: 20, title: "Vacation Mode", rout: "/profile/vacation-mode", roles: SELLER_ROLES },
            { id: 21, title: "Change Password", rout: "/profile/change-password" },
        ],
    },
];

const isAllowed = (roles: UserRole[] | undefined, role: UserRole) =>
    !roles || roles.includes(role);

export function getRoutesByRole(role: UserRole): ProfileRoute[] {
    return profileRouts
        .filter((group) => isAllowed(group.roles, role))
        .map((group) => ({
            ...group,
            routs: group.routs.filter((r) => isAllowed(r.roles, role)),
        }))
        .filter((group) => group.routs.length > 0); // drop groups left empty
}