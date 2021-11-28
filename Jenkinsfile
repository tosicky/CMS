pipeline {
    agent any
    stages{
//         stage('fetch repository') {
//             steps{
//                 checkout scm
//             }
//         }
        
        stage('Build Image') {
            steps {
                script {
                    def app = docker.build("tosicky/allhandsdev:cms-app-v1")
                    docker.withRegistry('https://registry.hub.docker.com', 'cred') {
                    app.push("${env.BUILD_NUMBER}")
                    app.push()
                }
            }
        }
      }
        stage('Deploy image ec2') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    sshagent(credentials: ['ec2-dev']) {
                        sh "ssh ec2-user@52.89.51.188 ./deploy_image.sh"
                    }
                }
            }
        }
        
    }
}
