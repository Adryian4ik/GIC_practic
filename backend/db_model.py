from sqlalchemy import Column, String, ForeignKey, DateTime, Float, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship




Base = declarative_base()


class Task(Base):
    __tablename__ = 'Task'

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    date = Column(DateTime(timezone=False), nullable=False)
    latitude = Column(Float , nullable=False)
    longitude = Column(Float , nullable=False)
    actual = Column(Boolean, nullable=False)
    name = Column(String, nullable=False)

    description = relationship("Description", back_populates="task")


class Description(Base):
    __tablename__ = 'Description'

    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False)
    task_id = Column(UUID(as_uuid=True), ForeignKey('Task.id'), nullable=False)
    text = Column(String, nullable=False)
    time = Column(DateTime(timezone=False), nullable=False)

    task = relationship("Task", back_populates="description")
