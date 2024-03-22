from src.lib.workbook_validator import validate

# TODO: add typing for lambda context and event
#       download the workbook from s3 and pass it to the validate() function
def lambda_handler(event, context):
    validate()
    return { 
        'message' : 'success'
    }
