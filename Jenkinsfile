pipeline {

    agent {
        docker {
            image 'node:18'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                credentialsId: 'github-token',
                url: 'https://github.com/AsimVhora/ISEC6000-NodeJS-CICD-22832298'
            }
        }


        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }


        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }


        stage('Build Docker Image') {
            steps {
                sh 'docker build -t nodejs-cicd-app .'
            }
        }


        stage('Run Docker Container') {
            steps {
                sh '''
                docker stop nodejs-container || true
                docker rm nodejs-container || true
                docker run -d --name nodejs-container -p 8080:8080 nodejs-cicd-app
                '''
            }
        }


        stage('Verify Application') {
            steps {
                sh '''
                sleep 5
                curl localhost:8080
                '''
            }
        }

    }


    post {
        success {
            echo 'NodeJS CI/CD Pipeline completed successfully'
        }

        failure {
            echo 'Pipeline failed'
        }
    }
}
