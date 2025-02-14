# Dockerfile (backend)
FROM python:3.10-slim

WORKDIR /app

RUN pip install --upgrade pip
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install 

COPY backend/ .

COPY backend/entrypoint.sh .
RUN sed -i 's/\r$//g' entrypoint.sh
RUN chmod +x entrypoint.sh


ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


