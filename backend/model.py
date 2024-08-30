from pydantic import BaseModel

class TaskResponse(BaseModel):
    id: str
    date: float
    lat: float | None
    long: float | None
    actual: bool
    name: str


class DescriptionResponse(BaseModel):
    id: str
    text: str
    datetime: float


class TaskRequest(BaseModel):
    date: float
    lat: float | None
    long: float | None
    name: str

class DescriptionRequest(BaseModel):
    task_id: str
    text: str






