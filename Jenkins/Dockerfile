FROM jenkins/jenkins:latest
# if we want to install via apt
USER root
RUN apt-get update && apt-get install -y sudo vim
# drop back to the regular jenkins user - good practice
RUN echo "jenkins ALL=NOPASSWD: ALL" >> /etc/sudoers
USER jenkins
