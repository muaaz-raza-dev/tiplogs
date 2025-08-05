interface Igroup{
    id:string
    name:string;
    is_active:boolean
}

export interface IgroupList extends Igroup{
 individuals : number ;

}

export interface IgroupHistory{
    history:{
        is_active:boolean ;
        updated_at:string ; 
    }[]
    created_at:string
}

export interface IGroupListingAtom{
    groups: IgroupList[]
    filtered_groups:IgroupList[]
    filters:{input:string}
    count:number
    total:number
}
