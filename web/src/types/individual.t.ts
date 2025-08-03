import { z } from "zod";

export const RegisterIndividualSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required"),

  father_name: z
    .string()
    .min(1, "Father name is required"),


  email: z.string().email().or(z.literal("")).optional(),

  contact: z.string().optional(),
  cnic: z.string().optional(),
  dob: z
    .string()
    .min(1, "Date of birth is required"),

  doa: z
    .string()
    .min(1, "Date of admission is required"),

  gender: z.enum(["male", "female", "other"], {
    error: () => ({ message: "Gender is required" }),
  }),

  grno: z
    .string()
    .min(1, "GR No is required"),

  roll_no: z
    .string()
    .min(1, "Roll No is required"),

  group: z
    .string()
    .min(1, "Group is required"),
});


export type IRegisterIndividualForm = z.infer<typeof RegisterIndividualSchema> 



export interface IindividualList{
  full_name:string
  father_name:string 
  group:string ;
  contact:string ;
  grno:string
  email:string ;
  id:string;
  doa:string
}
export interface IindividualListingAtom {
  results: { [key: string]: IindividualList[] }; 

  filters: {
    q: string;
    group: string;
  };

  count: number;
  total: number;
}


export interface IindividualDetailedResponse {
  personal_details:{
  full_name:string
  father_name:string 
  contact:string ;
  email:string ;
  id:string;
  "Date of birth":string
  gender :string ;
  cnic:string ;
  photo :string ;
}
acedemic_details : {
  roll_no:string ;
  group :{id:string,name:string}
  grno:string
  "Date of admission":string
  }
  account_details:{
    approved_by:{id:string,name:string}
    username:string;
    "Created on":string ;
  }
}




export const SelfRegisterIndividualSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required"),

  father_name: z
    .string()
    .min(1, "Father name is required"),


  email: z.string().email().or(z.literal("")).optional(),

  contact: z.string().optional(),
  cnic: z.string().optional(),
  dob: z.date({error:"date of birth is required"}) ,

  gender: z.enum(["male", "female", "other"], {
    error: () => ({ message: "Gender is required" }),
  }),

});


export type IselfRegisterSchema = z.infer<typeof SelfRegisterIndividualSchema> 

export interface IIselfRegisterSchemaRequestPayload extends Omit<IselfRegisterSchema,"dob">{
dob:string
}