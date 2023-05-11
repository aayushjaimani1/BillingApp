#import the libraries
from multiprocessing.sharedctypes import Value
import pandas as pd 
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity 
from sklearn.feature_extraction.text import CountVectorizer
from textblob import TextBlob

#load the data
path_to_csv_file="C:/xampp/htdocs/Ode2Code2.0/billingsystem/Python/Projecctt.csv"
#store the data
df=pd.read_csv(path_to_csv_file)
#show the first 5 rows of data
# df.head(5)

# df.shape

#create a list of important columns for the recommandation engine 
columns = ['Brand','Model','Price in India','id','1 stars','5 stars','link']

#show the data
df[columns].head(3)

#check for any missing value 
df[columns].isnull().values.any()

#create a function to combine the values of the important columns into a single string 
def get_important_features(data):
  important_features=[]
  for i in range(0,data.shape[0]):
    important_features.append(data['Brand'][i]+' '+data['Model'][i]+' '+data['link'][i])


  return important_features

#create a column to hold the combined strings
df['important_features']=get_important_features(df)

#Show 
# df.head(3)

#Convert the text to a matrix of token counts
cm=CountVectorizer().fit_transform(df['important_features'])

#get the cosine similarity matrix from teh count matrix 
cs=cosine_similarity(cm)

#Print the cosint similartiy matrix
# print(cs)

#Get the shape of the cosine similarity matrix
cs.shape

#get the company of the laptop that the user likes
category='Laptop'
name='HP'
rating='4'
max_price = '20000'

#Find the laptop id 
model_id=df[df.Brand==name]['id'].values[0]
# print(model_id)

  

#create a list of enumerations for the similarity score
scores=list(enumerate(cs[model_id]))

#sort the list
sorted_scores=sorted(scores,key=lambda x:x[1], reverse=True)
sorted_scores=sorted_scores[1:]

#Print the sorted scores
# print (sorted_scores)

#create a loop to print the first 5 similar laptops 
j=0
print ('The 5 most recommended laptop of company ',name,'are : \n' )
mydic={}
for item in sorted_scores:
    laptop_review=df[df.id==item[0]]['reviewDescription'].values[0]
    blog1=TextBlob(laptop_review)
    mydic[item[0]]=blog1.sentiment
    j=j+1
    if j>10:
      # sort_mydic={}
      # sort_mydic=sorted(mydic.items(),key=lambda x:x[1],reverse=True)
      # # print(mydic)
      sorted_values = sorted(mydic.values(),reverse=True) # Sort the values
      sorted_dict = {}

      for i in sorted_values:
          for k in mydic.keys():
              if mydic[k] == i:
                  sorted_dict[k] = mydic[k]
                  break
      # print(sorted_dict)
      k=0
      for key,value in sorted_dict.items():
          laptop_models=df[df.id==key+1]['Model'].values[0]
          laptop_price=df[df.id==key+1]['Price in India'].values[0]
          laptop_bestbuylink=laptop_price=df[df.id==key+1]['link'].values[0]
          laptop_ram=laptop_price=df[df.id==key+1]['RAM'].values[0]
          laptop_size=laptop_price=df[df.id==key+1]['Size'].values[0]
          print( k+1,laptop_models,"   ",laptop_price,"   ",laptop_bestbuylink,"    ",laptop_ram,"    ",laptop_size,"\n")
          k=k+1
          if k>4:
            break
      break


# print(sort_mydic)
# print(type(sort_mydic))
# for i, value in sort_mydic.items():
#   print(i)
# for item in sorted_scores:

