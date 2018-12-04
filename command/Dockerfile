FROM python:3.6.7-alpine

COPY . /

RUN pip3 install -r requirements.txt

CMD ["./wait_for.sh","kafka:9092","--","python3", "countdown.py"]