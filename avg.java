import java.util.Scanner;
public class avg {
    static double avg(int a, int b, int c){
        return(a+b+c)/3.0;
    }
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.println(avg(a,b,c));

    }
    
}
