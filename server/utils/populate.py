from typing import List ,Dict ,Type 
from beanie import Document

async def PopulateDocs(  
    documents: List[Document],
    fields: List[str],
    models: Dict[str, Type[Document]]
):
    for  doc in documents : 
        for f in fields :
            model = models.get(f)
            value = getattr(doc,f)
            print(f,value)
            populated = await value.fetch() 
        setattr(doc, f, populated)

    return documents




        
