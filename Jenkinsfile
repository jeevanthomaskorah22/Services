pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'jtk022'
        DOCKERHUB_PASS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Prepare') {
            steps {
                echo 'Code already checked out by Jenkins'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    def services = [
                        'order-service',
                        'payment-service',
                        'shipping-service',
                        'product-service',
                        'user-service',
                        'ui-service'
                    ]
                    for (service in services) {
                        bat "docker build -t %DOCKERHUB_USER%/${service}:latest .\\${service}"
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    bat "echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin"
                    def services = [
                        'order-service',
                        'payment-service',
                        'shipping-service',
                        'product-service',
                        'user-service',
                        'ui-service'
                    ]
                    for (service in services) {
                        bat "docker push %DOCKERHUB_USER%/${service}:latest"
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                bat "docker-compose down"
                bat "docker-compose up -d --build"
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            bat 'docker system prune -f'
        }
    }
}
