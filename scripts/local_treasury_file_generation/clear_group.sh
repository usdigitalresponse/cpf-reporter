export GROUP=/aws/lambda/localstack-lambda-project-1C
for STREAM in $(awslocal logs describe-log-streams --log-group-name $GROUP  --query logStreams[*].logStreamName  --output text --order-by LastEventTime --descending) ;
do  
    # echo awslocal logs delete-log-stream --log-group-name $GROUP  --log-stream-name $STREAM
    echo awslocal logs get-log-events --log-group-name $GROUP  --log-stream-name $STREAM --output table
    # 96b0d3824ddb7e729cfffa39dfb7e77e has 2 events one is empty and another is Zip
    # c5478925bc022449b1863cdcec34d6b4 has 1 event which is empty
    # 2905b589d254013752662fdaf9b18acc has 1 event which is empty
    # f6577110a1e67636352b0e36b5e7b8fb has 1 event which is empty
done
