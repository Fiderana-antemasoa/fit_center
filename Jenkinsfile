pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'npm ci'
                    bat 'npx prisma generate'
                    bat 'npm run build'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Docker sera exécuté sur le serveur Linux de déploiement.'
            }
        }
    }

    post {
        success {
            echo 'Pipeline FitCenter terminé avec succès.'
        }

        failure {
            echo 'Le pipeline FitCenter a échoué.'
        }
    }
}