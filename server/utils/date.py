from datetime import datetime
def GetAttendanceDate(date_str:str):
    year , month ,day = map(int, date_str.split("-"))
    att_date = datetime(year, month, day, 0, 0, 0)
    return att_date

