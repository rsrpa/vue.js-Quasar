
#!/bin/zsh
# dev

  cp ../nt-sls/app/lib/nt-dev/aws-exports.js ./src
  quasar build -m pwa
  aws s3 sync ./dist/pwa s3://dev.amtechsolutions.co.nz --profile nt-dev 
  aws cloudfront create-invalidation --distribution-id E4SHN5U3V2ZHR --paths "/*" --profile nt-dev

## test

  # cp ../nt-sls/app/lib/nt-test/aws-exports.js ./src
  # quasar build -m pwa
  # aws s3 sync ./dist/pwa s3://test.amtechsolutions.co.nz --profile nt-test 
  # aws cloudfront create-invalidation --distribution-id E2IKT859Z2MTBO --paths "/*" --profile nt-test

# # prod

  # cp ../nt-sls/app/lib/nt-prod/aws-exports.js ./src
  # quasar build -m pwa
  # aws s3 sync ./dist/pwa s3://stock.amtechsolutions.co.nz --profile nt-prod 
  # aws cloudfront create-invalidation --distribution-id E4X9WC7YZVOOF --paths "/*" --profile nt-prod

## bupadev 
  # cp ../nt-sls/app/lib/bupadev/aws-exports.js ./src
  # quasar build -m pwa
  # aws s3 sync ./dist/pwa s3://bupadev.amtechsolutions.co.nz --profile bupadev
  # aws cloudfront create-invalidation --distribution-id E1SCI5GKE6FHUM --paths "/*" --profile bupadev

## bupatest 
  # cp ../nt-sls/app/lib/bupatest/aws-exports.js ./src
  # quasar build -m pwa
  # aws s3 sync ./dist/pwa s3://bupatest.amtechsolutions.co.nz --profile bupatest
  # aws cloudfront create-invalidation --distribution-id EAESGRW11KUH3 --paths "/*" --profile bupatest

## bupaprod 
  # cp ../nt-sls/app/lib/bupaprod/aws-exports.js ./src
  # quasar build -m pwa
  # aws s3 sync ./dist/pwa s3://bupa.amtechsolutions.co.nz --profile bupaprod
  # aws cloudfront create-invalidation --distribution-id E2VY91BTXDQ1QF --paths "/*" --profile bupaprod

## upwork
  # cp ../nt-sls/app/lib/upwork/aws-exports.js ./src
  # quasar build -m pwa
  # aws s3 sync ./dist/pwa s3://upwork.amtechsolutions.co.nz --profile upwork
  # aws cloudfront create-invalidation --distribution-id ESH6VKIAN2D7O --paths "/*" --profile upwork