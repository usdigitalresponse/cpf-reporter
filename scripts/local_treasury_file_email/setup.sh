# Copy the file locally
mkdir tmp
cp -r ../../python/* tmp/
cp tmp/src/functions/generate_presigned_url_and_send_email.py tmp/

# Install requirements locally
cd tmp
poetry install --only main --sync
cp --recursive .venv/lib/python*/site-packages/* .


# Zip the file
zip -r sendTreasuryReportLambda.zip .
mv sendTreasuryReportLambda.zip ..
cd ..

# Clean up
rm -rf tmp
