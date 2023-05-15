path_to_csv_file = "https://raw.githubusercontent.com/SkullCreek/BillingApp/main/server/Recommend%20Product/Projectt.csv"
recommendation_system = LaptopRecommendationSystem(path_to_csv_file)
recommended_laptops = recommendation_system.recommend_laptops(brand='HP', color='Black', battery_life=5, max_price=50000)
print("\nCollaborative Filtering Recommendations:")
print(recommended_laptops)