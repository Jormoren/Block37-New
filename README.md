# Block37-New

Block 37: Unit 4 Career Simulation (Uni/ACC) 

Introduction

In the email above, Calliope has requested that you build the back end first at the client's request. In order for you to have a full understanding of the full stack application, review the following requirements for each user experience: 
As a user (not logged in), I should be able to:

    Access the website via the internet so I can browse and purchase products.
    View all available products.
    View the details for an individual product, including product descriptions, photos, price, etc.
    If I do not have an account, create an account.
    If I do have an account, log into my account.

As a user (logged in), I should be able to: 

    Have a persistent cart to revisit and pick up where I left off.
        For example, I am logged in on my mobile device and add some items to my cart. When I open the browser on my laptop and log in, I want to see those items in my cart.
        No one else should be able to edit my cart except me.
    Add a product to my cart.
    Edit my cart if I change my mind:
        Change the quantity of a product in my cart.
        Remove a product from my cart.
        No one else should be able to edit my cart except me.
    "Check out" the items in my cart, i.e., purchase the products.
        Think of the user experience when checking out on a typical e-commerce site like Amazon, etc.
        You can start by simulating the experience of checking out with a simple confirmation page.

As an administrator, I should be able to: 

    View a list of all products.
    Add, edit, and remove products.
        No one else should have access.
    View a list of all users.
        This list should include all relevant user information.
            This could include name, email address, mailing address, phone number, billing information, etc.

As an engineer, I should:

    Have a well-seeded database so that I can simulate several different scenarios for the user stories below.
        By doing this, you set yourselves up to tackle many of the points throughout the tiers. In the long run, this will potentially save you tons of time.
        For example, seed hundreds of products with dummy data so that when you get to the “pagination” user story, you will not have to worry about adding more products.
        Likewise, add a bunch of users with products in their carts so editing the cart can be worked on without already having the “add to cart” functionality built out.
    Have secured user data so that no one can unrightfully manipulate information.

There are three tabs below to help you stay organized as you work on this simulation.
