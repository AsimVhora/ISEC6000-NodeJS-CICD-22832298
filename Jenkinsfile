pipeline {

    agent {
        label 'docker-agent'
    }

    environment {
        IMAGE_NAME = "nodejs-cicd-app"
        CONTAINER_NAME = "nodejs-test-container"
        CI_CONTAINER_NAME = "nodejs-ci-${BUILD_NUMBER}"
        PORT = "8081"
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
                    docker create \
                        --name ${CI_CONTAINER_NAME} \
                        node:18 \
                        sh -c "tail -f /dev/null"

                    docker cp . ${CI_CONTAINER_NAME}:/app

                    docker start ${CI_CONTAINER_NAME}

                    docker exec ${CI_CONTAINER_NAME} \
                        sh -c "cd /app && npm install"
                '''
            }
        }

        stage('Security Scan') {
            steps {
                sh '''
                    echo "Running npm security audit..."

                    docker exec ${CI_CONTAINER_NAME} \
                        sh -c "cd /app && npm audit --audit-level=high"

                    echo "Security scan completed successfully"
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                    docker exec ${CI_CONTAINER_NAME} \
                        sh -c "cd /app && npm test"
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

                    docker exec ${CONTAINER_NAME} \
                        node -e "
                        const http = require('http');

                        http.get('http://localhost:8080', (res) => {
                            let data = '';

                            res.on('data', chunk => {
                                data += chunk;
                            });

                            res.on('end', () => {
                                console.log('HTTP Status:', res.statusCode);
                                console.log('Response:', data);

                                if (res.statusCode !== 200) {
                                    process.exit(1);
                                }

                                if (!data.includes('Hello World')) {
                                    process.exit(1);
                                }

                                console.log('Application verification completed successfully');
                            });
                        }).on('error', (err) => {
                            console.error('Application verification failed:', err);
                            process.exit(1);
                        });
                        "
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

                docker stop ${CI_CONTAINER_NAME} || true
                docker rm ${CI_CONTAINER_NAME} || true
            '''
        }
    }
}
