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
                    bat 'npm test'
                    bat 'set DATABASE_URL=postgresql://postgres:fitcenter_dev@localhost:5433/salle_sport&& npx prisma generate'
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

        stage('Deploy to Render') {
    steps {
        withCredentials([
            string(
                credentialsId: 'render-deploy-hook',
                variable: 'RENDER_DEPLOY_HOOK'
            )
        ]) {
            bat 'curl -X POST "%RENDER_DEPLOY_HOOK%"'
        }
        echo 'CI/CD automatique FitCenter'
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