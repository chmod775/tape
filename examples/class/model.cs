class Car
{
    // Fields
    private string make;
    private string model;
    private int year;
    private double speed;

    // Constructors
    public Car()
    {
        make = "unknown";
        model = "unknown";
        year = 0;
        speed = 0.0;
    }

    public Car(string make, string model, int year)
    {
        this.make = make;
        this.model = model;
        this.year = year;
        this.speed = 0.0;
    }

    public Car(string make, string model, int year, double speed)
    {
        this.make = make;
        this.model = model;
        this.year = year;
        this.speed = speed;
    }

    // Properties
    public string Make
    {
        get { return make; }
        set { make = value; }
    }

    public string Model
    {
        get { return model; }
        set { model = value; }
    }

    public int Year
    {
        get { return year; }
        set { year = value; }
    }

    public double Speed
    {
        get { return speed; }
        set { speed = value; }
    }

    // Methods
    public void Accelerate()
    {
        speed += 10;
    }

    public void Brake()
    {
        speed -= 10;
    }

    public void PrintInfo()
    {
        Console.WriteLine("Make: " + make);
        Console.WriteLine("Model: " + model);
        Console.WriteLine("Year: " + year);
        Console.WriteLine("Speed: " + speed);
    }
}
