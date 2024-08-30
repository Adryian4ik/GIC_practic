from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI
import uvicorn
from sqlalchemy import create_engine, table
from uuid import uuid4

from fastapi.middleware.cors import CORSMiddleware

from model import *
from db_model import *
from sqlalchemy.orm import Session, sessionmaker

session: Session

def db_connect():
    global session
    engine = create_engine(f'postgresql://postgres:123456@localhost:5432/CEC')
    session_type = sessionmaker(bind=engine)
    session = session_type()
    Base.metadata.create_all(engine)


def db_disconnect():
    global session
    try:
        session.close()
    except NameError:
        pass


@asynccontextmanager
async def lifespan(app: FastAPI):

    db_connect()

    yield()

    db_disconnect()

app = FastAPI(lifespan=lifespan)
origins = [
        "http://localhost:4200",
    ]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/tasks')
async def get_task_list(actual: bool = True) -> list[TaskResponse]:
    global session
    task_list = session.query(Task).where(Task.actual == actual).all()
    return [TaskResponse(**{
        'id': str(task.id),
        'date': task.date.strftime('%s'),
        'lat': task.latitude,
        'long': task.longitude,
        'actual': task.actual,
        'name': task.name
    }) for task in task_list]


@app.post('/task')
async def create_task(request: TaskRequest) -> TaskResponse:
    global session
    task = Task(id=uuid4(), date=datetime.fromtimestamp(request.date).date(),
                longitude=request.long, latitude=request.lat,
                actual=True, name=request.name)
    session.add(task)
    session.commit()
    return TaskResponse(**{
        'id': str(task.id),
        'date': task.date.strftime('%s'),
        'lat': task.latitude,
        'long': task.longitude,
        'actual': task.actual,
        'name': task.name
    })


@app.patch('/task')
async def change_actual_of_task(task_id: str, actual: bool) -> TaskResponse:
    global session
    task = session.get_one(Task, {'id': task_id})
    task.actual = actual
    session.commit()
    return TaskResponse(**{
        'id': str(task.id),
        'date': task.date.strftime('%s'),
        'lat': task.latitude,
        'long': task.longitude,
        'actual': task.actual,
        'name': task.name,
    })


@app.get('/descriptions')
async def get_descriptons(task_id: str) -> list[DescriptionResponse]:
    global session
    descriptions_list = session.query(Description).order_by(Description.time).where(Description.task_id == task_id).all()
    return [DescriptionResponse(**{
        'id': str(description.id),
        'datetime': description.time.timestamp(),
        'text': description.text
    }) for description in descriptions_list]


@app.post('/description')
async def create_description(request: DescriptionRequest) -> DescriptionResponse:
    global session
    description = Description(id=uuid4(), time=datetime.now(), text=request.text, task_id=request.task_id)
    session.add(description)
    session.commit()
    return DescriptionResponse(**{
        'id': str(description.id),
        'datetime': description.time.timestamp(),
        'text': description.text
    })

uvicorn.run(app)
