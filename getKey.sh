gcloud iam service-accounts keys create ./key.json \
  --iam-account localdev@cookbook-e20d7.iam.gserviceaccount.com

echo "GCLOUD_CREDENTIALS=$(base64 --wrap=0 ./key.json)" >> ./.env

rm ./key.json