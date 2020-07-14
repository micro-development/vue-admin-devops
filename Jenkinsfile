pipeline {
  agent any
  environment {
    web_root = '/web/ai.ittlr.org/ittlr-admin-ci/'
  }
  stages {
    stage('Test System Info') {
      steps {
        sh "git --help"
        sh 'node -v'
        sh 'npm -v'
        sh 'cnpm -v'
        sh 'yarn -v'
        sh "it-md"
        sh "it-jenkins-deploy"
        sh "echo $web_root"
      }
    }
    stage('Auto Deploy') {
      steps {
        sh '''
              it-jenkins-deploy $web_root
        '''
      }
    }
    stage('Init And Update All Module') {
      steps {
        sh '''
              cd $web_root
              it-md install
              it-md update
        '''
      }
    }
    stage('Install Dependencies') {
      steps {
        sh '''
              cd $web_root
              yarn install
        '''
      }
    }
    stage('Setting Env') {
      steps {
        sh '''
              cd $web_root
              cp -rv /web/app-config/ai.ittlr.org/env-file/.env.production .
              ls -al
        '''
      }
    }
    stage('Building') {
      steps {
        sh '''
              cd $web_root
              npm run build
        '''
      }
    }
  }
}
