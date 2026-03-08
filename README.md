# hlpf-env-setup

## Practice: Development Environment

## Student

- Kononenko D.A;

- Group: 232/1;

```text
docker --version:
- Docker version 29.2.1, build a5c7197d72

docker compose version:
- Docker Compose version 5.1.0

docker run --rm hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
17eec7bbc9d7: Pull complete
ea52d2000f90: Download complete
Digest: sha256:ef54e839ef541993b4e87f25e752f7cf4238fa55f017957c2eb44077083d7a6a
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/


docker compose run --rm npm npm -v
Container hlpf-env-setup-npm-run-ddb986f1c3ea Creating
Container hlpf-env-setup-npm-run-ddb986f1c3ea Created
11.11.0

❯ docker compose run --rm npm node --version
Container hlpf-env-setup-npm-run-a79bf759e02d Creating
Container hlpf-env-setup-npm-run-a79bf759e02d Created
v25.8.0

docker compose up --build:
Successfully built c5e3e6d6d66f
Successfully tagged hlpf-env-setup-npm:latest
[+] up 3/3
 ✔ Image hlpf-env-setup-npm       Built                                                                                                                   19.0s
 ✔ Network hlpf-env-setup_default Created                                                                                                                 0.0s
 ✔ Container hlpf-env-setup-npm-1 Created                                                                                                                 0.1s
Attaching to npm-1
npm-1  | 11.11.0
npm-1 exited with code 0
```
