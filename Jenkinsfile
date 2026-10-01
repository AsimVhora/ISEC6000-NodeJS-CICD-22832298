pipeline {

    agent {
        label 'docker-agent'
    }

    environment {
        IMAGE_NAME = "nodejs-cicd-app"
        CONTAINER_NAME = "nodejs-test-container"
        PORT = "8080"
        CI_CONTAINER = "nodejs-ci-${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git(
                    branch: 'main',
                    credentialsId: 'github-token',
                    url: 'https://github.com/AsimVhora/ISEC6000-NodeJS-CICD-22832298'
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    docker create --name ${CI_CONTAINER} node:18
                    docker cp . ${CI_CONTAINER}:/app
                    docker start ${CI_CONTAINER}
                    docker exec ${CI_CONTAINER} sh -c "cd /app && npm install"
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    docker exec ${CI_CONTAINER} sh -c "cd /app && npm test"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t ${IMAGE_NAME} .
                '''
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    docker run -d \
                    --name ${CONTAINER_NAME} \
                    -p ${PORT}:8080 \
                    ${IMAGE_NAME}
                '''
            }
        }

        stage('Verify Application') {
            steps {
                sh '''
                    sleep 5
                    curl http://localhost:${PORT}
                    echo "Application verification completed"
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

        always {
            sh '''
                docker stop ${CONTAINER_NAME} || true
                docker rm ${CONTAINER_NAME} || true
                docker rm ${CI_CONTAINER} || true
            '''
        }
    }
}
