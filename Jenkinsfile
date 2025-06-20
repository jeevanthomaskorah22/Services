pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'jtk022'
        DOCKERHUB_PASS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/jeevanthomaskorah22/Services.git'
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
                        sh "docker build -t ${DOCKERHUB_USER}/${service}:latest ./${service}"
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                script {
                    sh "echo ${DOCKERHUB_PASS} | docker login -u ${DOCKERHUB_USER} --password-stdin"
                    def services = [
                        'order-service',
                        'payment-service',
                        'shipping-service',
                        'product-service',
                        'user-service',
                        'ui-service'
                    ]
                    for (service in services) {
                        sh "docker push ${DOCKERHUB_USER}/${service}:latest"
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f'
        }
    }
}
