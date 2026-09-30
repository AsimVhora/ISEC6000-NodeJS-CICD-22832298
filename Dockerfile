FROM node:18

USER root

RUN apt-get update && \
    apt-get install -y docker.io curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

CMD ["bash"]
