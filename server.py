from flask import Flask, render_template, url_for, request,redirect
import csv
app = Flask(__name__)
# print(__name__)


# @app.route('/<username>/<int:post_id>',)
# def hello_world(username=None, post_id=None):
#     return render_template('index.html', name=username, post_id=post_id)

# @app.route('/<string:page_name>')
# def blog(page_name):
#     return render_template(page_name)  


 
# to make the page dynamic
@app.route('/')
def my_home():
    return render_template('index.html') 
 
@app.route('/<string:page_name>')
def html_page(page_name):
    return render_template(page_name) 

def write_to_csv(data):
    with open('database.csv', mode='a') as database2:

        fullname = data["fullname"]
        email = data["email"]
        tel = data["tel"]
        subject = data["subject"]
        message = data["message"]
        csv_writer = csv.writer(database2, delimiter=',', quotechar='"',quoting= csv.QUOTE_MINIMAL) 
        csv_writer.writerow([fullname,email,tel,subject,message])
# def write_to_file(data):
#     with open('database.txt', mode='a') as database:

#         fullname = data["fullname"]
#         email = data["email"]
#         tel = data["tel"]
#         subject = data["subject"]
#         message = data["message"]
#         file = database.write(f'\n{fullname},{email},{tel},{subject},{message}')
 
@app.route('/submit_form', methods=['POST','GET'])
def submit_form():
    if request.method =='POST':
        try:
            data = request.form.to_dict()
            write_to_csv(data)
            return redirect('thankyou.html')
        except:
            return 'did not save to database'
    else:
        return 'something went wrong. Try again'
    



if __name__ == '__main__':
    app.run(debug=True) 
 

# @app.route('/blog')
# def blog():
#     return 'This blog is amazing'  

 