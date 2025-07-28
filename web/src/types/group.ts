interface Igroup{
    name:string;
    is_active:boolean
}

interface IgroupList extends Igroup{
 individual : number ;

}

export interface IGroupListingAtom{
    groups: IgroupList[]
    filtered_groups:IgroupList[]
    filters:{input:string}
    count:number
    total:number
}
