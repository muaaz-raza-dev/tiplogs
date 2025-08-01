export enum OrganizationPlan{
    BASIC = "basic",
}

export interface Organization {
    id:string;
    name : string;
    individual_name : string;
    plan : OrganizationPlan;

}

