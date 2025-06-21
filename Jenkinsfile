pipeline {
    agent any

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
                        echo "Building image for ${service}..."
                        bat """
                        docker build --no-cache -t jtk022/${service}:latest .\\${service}
                        """
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    script {
                        bat """
                        echo %DOCKERHUB_PASS% | docker login -u %DOCKERHUB_USER% --password-stdin
                        """
                        def services = [
                            'order-service',
                            'payment-service',
                            'shipping-service',
                            'product-service',
                            'user-service',
                            'ui-service'
                        ]
                        for (service in services) {
                            echo "Pushing ${service} to Docker Hub..."
                            def pushStatus = bat(script: """
                                docker push %DOCKERHUB_USER%/${service}:latest
                                if errorlevel 1 exit /b 1
                                timeout /t 5
                            """, returnStatus: true)

                            if (pushStatus != 0) {
                                error("Docker push failed for ${service}")
                            }
                        }
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
