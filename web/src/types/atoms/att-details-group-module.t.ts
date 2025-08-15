export interface IattDetailsOverviewFilters{
    group:string;
    module:string;
    start_date:string; // week limit
}


export interface IattDetailsOverviewDoc{
att_date:string;
    is_taken: boolean;
    is_base_exists: boolean;

    att_group?: {
      att_base: string;  
      attendance_status?: string; 
      status_counts:{
        present:number,
        absent:number,
        leave:number,
        late:number,
        half:number}}
}