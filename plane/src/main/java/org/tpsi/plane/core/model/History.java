package org.tpsi.plane.core.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class History {
    @Id
    @GeneratedValue
    private Long id;

    private Date date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private double velX;

    private double velY;

    private double velZ;

    private double posX;

    private double posY;

    private double posZ;

    public Long getId() {
	return id;
    }

    public void setId(Long id) {
	this.id = id;
    }

    public User getUser() {
	return user;
    }

    public void setUser(User user) {
	this.user = user;
    }

    public double getVelX() {
	return velX;
    }

    public void setVelX(double velX) {
	this.velX = velX;
    }

    public double getVelY() {
	return velY;
    }

    public void setVelY(double velY) {
	this.velY = velY;
    }

    public double getVelZ() {
	return velZ;
    }

    public void setVelZ(double velZ) {
	this.velZ = velZ;
    }

    public double getPosX() {
	return posX;
    }

    public void setPosX(double posX) {
	this.posX = posX;
    }

    public double getPosY() {
	return posY;
    }

    public void setPosY(double posY) {
	this.posY = posY;
    }

    public Date getDate() {
	return date;
    }

    public void setDate(Date date) {
	this.date = date;
    }

    public double getPosZ() {
	return posZ;
    }

    public void setPosZ(double posZ) {
	this.posZ = posZ;
    }

}
