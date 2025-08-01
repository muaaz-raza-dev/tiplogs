from typing import List 
from beanie import Document

async def PopulateDocs(  
    documents: List[Document],
    fields: List[str],
):
    for  doc in documents : 
        for f in fields :
            value = getattr(doc,f)
            populated = await value.fetch() 
            setattr(doc, f, populated)

    return documents




        
