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
                    def app = docker.build("tosicky/allhands-dev:cms-app-v1")
                    docker.withRegistry('https://registry.hub.docker.com', 'cred') {
                    app.push("${env.BUILD_NUMBER}")
                    app.push()
                }
            }
        }
        
        }
    }
}
